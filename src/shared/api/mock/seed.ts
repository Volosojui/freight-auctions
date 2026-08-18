import type {
  AuctionListItem,
  AuctionShowResponse,
  AuctionStatus,
  AuctionType,
  BetItem,
  BidMeasurementType,
  TradingStatus,
} from '../contract'
import { cityByName } from './cities'
import type { MockAuction } from './types'

const round2 = (n: number): number => Math.round(n * 100) / 100
const noVat = (withVat: number): number => round2(withVat / 1.2)

interface BetSeed {
  id: number
  createdAt: string
  contactName: string
  contactPhone: string
  orgId: number
  orgInn: string
  orgName: string
  priceWithVat: number
  place: number | null
  isWin: boolean
  isRejected: boolean
  cancelReason: string
  isCounter?: boolean
}

interface SeedParams {
  uuid: string
  id: number
  cargoNum: string
  aucType: AuctionType
  status: AuctionStatus
  tradingStatus: TradingStatus
  loadCity: string
  unloadCity: string
  loadDate: string
  unloadDate: string
  createdAt: string
  startTime: string
  stopTime: string
  startPrice: number
  currentPrice: number
  available: number
  min: number
  max: number
  step: number
  distance: number
  bidMeasurement: BidMeasurementType
  canSetBet: boolean
  isAvailable: boolean
  isBidder: boolean
  hasOwnBet: boolean
  ownBet: number | null
  win: boolean
  hideBetsHistory: boolean
  hidePointsAddressAndContacts: boolean
  noViewCargoPrice: boolean
  cargoName: string
  weight: number
  volume: number
  bodyType: string
  bets: BetSeed[]
}

function makeBet(auctionId: number, seed: BetSeed): BetItem {
  return {
    id: seed.id,
    created_at: seed.createdAt,
    auction_id: auctionId,
    subscriber_id: seed.orgId,
    contact_name: seed.contactName,
    contact_phone: seed.contactPhone,
    price_with_vat: seed.priceWithVat,
    price_no_vat: noVat(seed.priceWithVat),
    organization_id: seed.orgId,
    organization_inn: seed.orgInn,
    organization_name: seed.orgName,
    transporter_comment: null,
    is_rejected: seed.isRejected,
    is_counter: seed.isCounter ?? false,
    place: seed.place,
    is_win: seed.isWin,
    run_number: 0,
    cancel_reason: seed.cancelReason,
    price_info: {
      price_with_vat: seed.priceWithVat,
      price_no_vat: noVat(seed.priceWithVat),
      payment_type: 'Безналичная с НДС',
      vat_rate: '20',
    },
  }
}

function makeAuction(p: SeedParams): MockAuction {
  const load = cityByName(p.loadCity)
  const unload = cityByName(p.unloadCity)
  const currentNoVat = noVat(p.currentPrice)
  const pricePerKm = p.distance > 0 ? round2(currentNoVat / p.distance) : 0

  const listItem: AuctionListItem = {
    main: {
      id: p.id,
      cargo_num: p.cargoNum,
      cargo_date: p.loadDate,
      auc_type: p.aucType,
      order_uid: p.uuid,
      created_at: p.createdAt,
      priority_sort: p.id,
      is_assembly: false,
      price_per_km: pricePerKm,
    },
    organizer: {
      subscriber_id: 1000 + p.id,
      organization_id: 2000 + p.id,
      organization_name: 'ООО Логистик',
      organization_inn: '7700000000',
      organization_kpp: '770001001',
      is_hide_organization: false,
    },
    route: {
      load: {
        city: load.name,
        address: 'ул. Складская, 1',
        date: p.loadDate,
        city_gc_id: load.gc_id,
        points_count: 1,
      },
      unload: {
        city: unload.name,
        address: 'ул. Приёмная, 2',
        date: p.unloadDate,
        city_gc_id: unload.gc_id,
        points_count: 1,
      },
    },
    cargo: {
      name: p.cargoName,
      weight: p.weight,
      volume: p.volume,
      body_type: p.bodyType,
      truck_count: 1,
      is_cargo: true,
      is_international: false,
      containered: false,
      incoterms: '',
      conics: 0,
      belts: 0,
      adr: 0,
      coupling: false,
      air_pass: false,
      low_loader: false,
      additional_load: false,
      temp_from: 0,
      temp_to: 0,
      loading_types: { side: true, top: false, rear: true, full: false },
      docs: { tir: false, cmr: false, t1: false, med: false },
      car: null,
    },
    trading: {
      status: p.status,
      status_mobile: p.tradingStatus,
      start_time: p.startTime,
      stop_time: p.stopTime,
      bid_measurement_type: p.bidMeasurement,
      can_set_bet: p.canSetBet,
      allow_counter_bets: true,
      hide_points_address_and_contacts: p.hidePointsAddressAndContacts,
      direction: null,
      comment: null,
      is_bidder: p.isBidder,
      is_available: p.isAvailable,
      is_accredited: true,
      is_favorite: false,
      price: {
        start: p.startPrice,
        current: p.currentPrice,
        current_no_vat: currentNoVat,
      },
      your: { bet: p.hasOwnBet, last_bet: p.ownBet },
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      is_last_bet_with_vat: p.hasOwnBet ? true : null,
    },
    payment: {
      form: 'Безналичная с НДС',
      currency_code: 'RUB',
      consignor: 'ООО Грузоотправитель',
      consignee: 'ООО Грузополучатель',
    },
  }

  const detail: AuctionShowResponse = {
    main: {
      id: p.id,
      cargo_num: p.cargoNum,
      cargo_date: p.loadDate,
      order_uid: p.uuid,
      auc_type: p.aucType,
      created_at: p.createdAt,
    },
    organizer: {
      subscriber_id: 1000 + p.id,
      subscriber_code: `SUB-${p.id}`,
      infobase_code: 'IB-1',
      organization_name: 'ООО Логистик',
      organization_inn: '7700000000',
      organization_kpp: '770001001',
      organization_id: 2000 + p.id,
    },
    contacts: p.hidePointsAddressAndContacts
      ? []
      : [
          {
            name: 'Иванов Иван',
            phone: '+79001234567',
            work_phone: '+74950000000',
            uid: `contact-${p.id}`,
            email: 'logist@example.com',
          },
        ],
    cargo: {
      price: '150000',
      currency: 643,
      is_international: false,
      distance: p.distance,
      truck_count: 1,
      body_type: p.bodyType,
      temp_from: null,
      temp_to: null,
      conics: null,
      belts: null,
      adr: null,
      coupling: null,
      air_pass: null,
      low_loader: null,
      additional_load: null,
      containered: false,
      container_type: null,
      container_size: null,
      loading_types: { side: true, top: false, rear: true, full: false },
      docs: { tir: false, cmr: false, t1: false, med: false },
      car: {
        type: p.bodyType,
        weight: p.weight,
        volume: p.volume,
        width: 2.45,
        length: 13.6,
        height: 2.7,
      },
    },
    trading: {
      status: p.status,
      status_mobile: p.tradingStatus,
      start_time: p.startTime,
      stop_time: p.stopTime,
      bid_measurement_type: p.bidMeasurement,
      can_set_bet: p.canSetBet,
      allow_counter_bets: true,
      hide_bets_history: p.hideBetsHistory,
      hide_places: false,
      no_view_cargo_price: p.noViewCargoPrice,
      hide_points_address_and_contacts: p.hidePointsAddressAndContacts,
      is_bidder: p.isBidder,
      is_favorite: false,
      is_last_bet_with_vat: p.hasOwnBet ? true : null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: {
        start: p.startPrice,
        start_no_vat: noVat(p.startPrice),
        current: p.currentPrice,
        current_no_vat: currentNoVat,
        available: p.available,
        available_no_vat: noVat(p.available),
        min: p.min,
        min_no_vat: noVat(p.min),
        max: p.max,
        max_no_vat: noVat(p.max),
        step: p.step,
        step_no_vat: noVat(p.step),
        price_per_km: pricePerKm,
      },
      your: {
        bet: p.hasOwnBet,
        last_bet: p.ownBet !== null ? noVat(p.ownBet) : null,
        last_bet_with_vat: p.ownBet,
        win: p.win,
      },
      settings: {
        prolong_after_bet: 10,
        winner_confirm: 1,
        winner_counter_mode: null,
        transmission_time_in: 24,
        coefficient: 10,
      },
    },
    payment: {
      condition: null,
      condition_predefined: 'Оплата по факту',
      form: 'Безналичная с НДС',
      delay: 5,
      delay_type: 'WorkDays',
      currency_code: 'RUB',
      prepay: null,
    },
    assembly: { num: null, date: null },
    routes: [
      {
        row_num: 1,
        op_type: 'Loading',
        start_date: p.loadDate,
        end_date: p.loadDate,
        comment: null,
        contractor: 'ООО Грузоотправитель',
        contractor_inn: '7700000001',
        location: {
          city_name: load.name,
          city_full_name: `г. ${load.name}`,
          city_gc_id: load.gc_id,
          loading_address: p.hidePointsAddressAndContacts
            ? ''
            : 'ул. Складская, 1',
          lon: 37.6,
          lat: 55.75,
        },
        cargo: {
          name: p.cargoName,
          package_name: 'Паллета',
          weight: String(p.weight),
          volume: String(p.volume),
          length: '13.6',
          width: '2.45',
          height: '2.7',
          oversized: false,
          package_amount: 33,
        },
        contact: p.hidePointsAddressAndContacts
          ? { name: '', phone: '' }
          : { name: 'Иванов Иван', phone: '+79001234567' },
      },
      {
        row_num: 2,
        op_type: 'Unloading',
        start_date: p.unloadDate,
        end_date: p.unloadDate,
        comment: null,
        contractor: 'ООО Грузополучатель',
        contractor_inn: '7700000002',
        location: {
          city_name: unload.name,
          city_full_name: `г. ${unload.name}`,
          city_gc_id: unload.gc_id,
          loading_address: p.hidePointsAddressAndContacts
            ? ''
            : 'ул. Приёмная, 2',
          lon: 30.3,
          lat: 59.94,
        },
        cargo: {
          name: p.cargoName,
          package_name: 'Паллета',
          weight: String(p.weight),
          volume: String(p.volume),
          length: '13.6',
          width: '2.45',
          height: '2.7',
          oversized: false,
          package_amount: 33,
        },
        contact: p.hidePointsAddressAndContacts
          ? { name: '', phone: '' }
          : { name: 'Петров Пётр', phone: '+79007654321' },
      },
    ],
    admitted_organizations: [
      {
        id: 1,
        inn: '7700000000',
        is_main: true,
        name: 'ООО Логистик',
        full_name: 'Общество с ограниченной ответственностью «Логистик»',
        site: null,
        subscriber_id: 1000 + p.id,
        subscriber_code: `SUB-${p.id}`,
        subscriber_role: null,
        infobase_code: 'IB-1',
        infobase_address: null,
        nalog_key: null,
        hide_me: false,
        current_vat_rate: '20',
      },
    ],
    hide_bets_history: p.hideBetsHistory,
  }

  return {
    uuid: p.uuid,
    listItem,
    detail,
    bets: p.hideBetsHistory ? [] : p.bets.map((b) => makeBet(p.id, b)),
  }
}

/** Детерминированный сид: разнообразие типов, статусов, флагов и ставок. */
export function createSeedAuctions(): MockAuction[] {
  return SEEDS.map(makeAuction)
}

const SEEDS: SeedParams[] = [
  // Идут торги, ставку можно сделать, свои ставки есть, лидируем, есть история.
  {
    uuid: 'auc-0001',
    id: 1,
    cargoNum: '00000001001',
    aucType: 'Request',
    status: 'Auction',
    tradingStatus: 'Leading',
    loadCity: 'Пермь',
    unloadCity: 'Москва',
    loadDate: '2026-08-20T09:00:00+03:00',
    unloadDate: '2026-08-22T18:00:00+03:00',
    createdAt: '2026-08-18T08:00:00+03:00',
    startTime: '2026-08-19T10:00:00+03:00',
    stopTime: '2026-08-25T10:00:00+03:00',
    startPrice: 60000,
    currentPrice: 54000,
    available: 53500,
    min: 40000,
    max: 60000,
    step: 500,
    distance: 1200,
    bidMeasurement: 'PerRoute',
    canSetBet: true,
    isAvailable: true,
    isBidder: true,
    hasOwnBet: true,
    ownBet: 54000,
    win: false,
    hideBetsHistory: false,
    hidePointsAddressAndContacts: false,
    noViewCargoPrice: false,
    cargoName: 'Стройматериалы',
    weight: 20,
    volume: 82,
    bodyType: 'тентованный',
    bets: [
      {
        id: 101,
        createdAt: '2026-08-19T11:00:00+03:00',
        contactName: 'Иванов Иван',
        contactPhone: '+79001234567',
        orgId: 14,
        orgInn: '5900000001',
        orgName: 'ООО Перевозчик-1',
        priceWithVat: 54000,
        place: 1,
        isWin: false,
        isRejected: false,
        cancelReason: '',
      },
      {
        id: 102,
        createdAt: '2026-08-19T11:30:00+03:00',
        contactName: 'Сидоров Сидор',
        contactPhone: '+79005553311',
        orgId: 15,
        orgInn: '5900000002',
        orgName: 'ООО Перевозчик-2',
        priceWithVat: 55000,
        place: 2,
        isWin: false,
        isRejected: false,
        cancelReason: '',
      },
      {
        id: 103,
        createdAt: '2026-08-19T12:00:00+03:00',
        contactName: 'Отменённый Участник',
        contactPhone: '+79008889900',
        orgId: 16,
        orgInn: '5900000003',
        orgName: 'ООО Перевозчик-3',
        priceWithVat: 53000,
        place: null,
        isWin: false,
        isRejected: true,
        cancelReason: 'Не прошёл аккредитацию',
      },
    ],
  },
  // Тип Down, перебиты (Losing), ставку можно сделать.
  {
    uuid: 'auc-0002',
    id: 2,
    cargoNum: '00000001002',
    aucType: 'Down',
    status: 'Auction',
    tradingStatus: 'Losing',
    loadCity: 'Санкт-Петербург',
    unloadCity: 'Казань',
    loadDate: '2026-08-21T08:00:00+03:00',
    unloadDate: '2026-08-24T20:00:00+03:00',
    createdAt: '2026-08-18T09:00:00+03:00',
    startTime: '2026-08-19T09:00:00+03:00',
    stopTime: '2026-08-26T09:00:00+03:00',
    startPrice: 90000,
    currentPrice: 82000,
    available: 81500,
    min: 60000,
    max: 90000,
    step: 1000,
    distance: 1500,
    bidMeasurement: 'PerKm',
    canSetBet: true,
    isAvailable: true,
    isBidder: true,
    hasOwnBet: true,
    ownBet: 84000,
    win: false,
    hideBetsHistory: false,
    hidePointsAddressAndContacts: false,
    noViewCargoPrice: false,
    cargoName: 'Оборудование',
    weight: 18,
    volume: 60,
    bodyType: 'фургон',
    bets: [
      {
        id: 201,
        createdAt: '2026-08-19T10:00:00+03:00',
        contactName: 'Кузнецов Кузьма',
        contactPhone: '+79111112233',
        orgId: 21,
        orgInn: '7800000001',
        orgName: 'ООО Северный Путь',
        priceWithVat: 82000,
        place: 1,
        isWin: false,
        isRejected: false,
        cancelReason: '',
      },
      {
        id: 202,
        createdAt: '2026-08-19T10:20:00+03:00',
        contactName: 'Наш Водитель',
        contactPhone: '+79115556677',
        orgId: 22,
        orgInn: '7800000002',
        orgName: 'ООО Наша Компания',
        priceWithVat: 84000,
        place: 2,
        isWin: false,
        isRejected: false,
        cancelReason: '',
      },
    ],
  },
  // FixPrice, доступен, ставок ещё нет (пустой список), своей ставки нет.
  {
    uuid: 'auc-0003',
    id: 3,
    cargoNum: '00000001003',
    aucType: 'FixPrice',
    status: 'Planning',
    tradingStatus: 'NotParticipating',
    loadCity: 'Екатеринбург',
    unloadCity: 'Новосибирск',
    loadDate: '2026-08-23T07:00:00+05:00',
    unloadDate: '2026-08-26T19:00:00+07:00',
    createdAt: '2026-08-18T10:00:00+03:00',
    startTime: '2026-08-22T09:00:00+05:00',
    stopTime: '2026-08-28T09:00:00+05:00',
    startPrice: 120000,
    currentPrice: 120000,
    available: 120000,
    min: 100000,
    max: 120000,
    step: 0,
    distance: 1600,
    bidMeasurement: 'PerRoute',
    canSetBet: true,
    isAvailable: true,
    isBidder: false,
    hasOwnBet: false,
    ownBet: null,
    win: false,
    hideBetsHistory: false,
    hidePointsAddressAndContacts: false,
    noViewCargoPrice: false,
    cargoName: 'Металлопрокат',
    weight: 22,
    volume: 40,
    bodyType: 'бортовой',
    bets: [],
  },
  // Up, торги идут, ставку сделать НЕЛЬЗЯ (can_set_bet=false), не участвуем.
  {
    uuid: 'auc-0004',
    id: 4,
    cargoNum: '00000001004',
    aucType: 'Up',
    status: 'Auction',
    tradingStatus: 'NotParticipating',
    loadCity: 'Краснодар',
    unloadCity: 'Москва',
    loadDate: '2026-08-24T06:00:00+03:00',
    unloadDate: '2026-08-27T22:00:00+03:00',
    createdAt: '2026-08-18T11:00:00+03:00',
    startTime: '2026-08-20T09:00:00+03:00',
    stopTime: '2026-08-25T09:00:00+03:00',
    startPrice: 70000,
    currentPrice: 76000,
    available: 76500,
    min: 70000,
    max: 100000,
    step: 500,
    distance: 1400,
    bidMeasurement: 'PerRoute',
    canSetBet: false,
    isAvailable: false,
    isBidder: false,
    hasOwnBet: false,
    ownBet: null,
    win: false,
    hideBetsHistory: false,
    hidePointsAddressAndContacts: false,
    noViewCargoPrice: false,
    cargoName: 'Продукты питания',
    weight: 15,
    volume: 55,
    bodyType: 'рефрижератор',
    bets: [
      {
        id: 401,
        createdAt: '2026-08-20T10:00:00+03:00',
        contactName: 'Южный Водитель',
        contactPhone: '+79881112200',
        orgId: 41,
        orgInn: '2300000001',
        orgName: 'ООО ЮгТранс',
        priceWithVat: 76000,
        place: 1,
        isWin: false,
        isRejected: false,
        cancelReason: '',
      },
    ],
  },
  // Скрыта история ставок (hide_bets_history=true) — bets пустые в ответе.
  {
    uuid: 'auc-0005',
    id: 5,
    cargoNum: '00000001005',
    aucType: 'Request',
    status: 'Auction',
    tradingStatus: 'NotParticipating',
    loadCity: 'Москва',
    unloadCity: 'Пермь',
    loadDate: '2026-08-22T09:00:00+03:00',
    unloadDate: '2026-08-24T18:00:00+03:00',
    createdAt: '2026-08-18T12:00:00+03:00',
    startTime: '2026-08-20T09:00:00+03:00',
    stopTime: '2026-08-26T09:00:00+03:00',
    startPrice: 58000,
    currentPrice: 52000,
    available: 51500,
    min: 40000,
    max: 58000,
    step: 500,
    distance: 1200,
    bidMeasurement: 'PerRoute',
    canSetBet: true,
    isAvailable: true,
    isBidder: false,
    hasOwnBet: false,
    ownBet: null,
    win: false,
    hideBetsHistory: true,
    hidePointsAddressAndContacts: false,
    noViewCargoPrice: false,
    cargoName: 'Мебель',
    weight: 12,
    volume: 78,
    bodyType: 'тентованный',
    bets: [],
  },
  // Скрыты адреса/контакты и цена груза; свои ставки есть, победитель.
  {
    uuid: 'auc-0006',
    id: 6,
    cargoNum: '00000001006',
    aucType: 'Down',
    status: 'Finished',
    tradingStatus: 'Winner',
    loadCity: 'Казань',
    unloadCity: 'Екатеринбург',
    loadDate: '2026-08-15T08:00:00+03:00',
    unloadDate: '2026-08-17T20:00:00+05:00',
    createdAt: '2026-08-12T12:00:00+03:00',
    startTime: '2026-08-13T09:00:00+03:00',
    stopTime: '2026-08-14T09:00:00+03:00',
    startPrice: 100000,
    currentPrice: 88000,
    available: 88000,
    min: 70000,
    max: 100000,
    step: 1000,
    distance: 1100,
    bidMeasurement: 'PerRoute',
    canSetBet: false,
    isAvailable: false,
    isBidder: true,
    hasOwnBet: true,
    ownBet: 88000,
    win: true,
    hideBetsHistory: false,
    hidePointsAddressAndContacts: true,
    noViewCargoPrice: true,
    cargoName: 'Химия',
    weight: 19,
    volume: 50,
    bodyType: 'фургон',
    bets: [
      {
        id: 601,
        createdAt: '2026-08-13T10:00:00+03:00',
        contactName: 'Наш Водитель',
        contactPhone: '+79115556677',
        orgId: 22,
        orgInn: '7800000002',
        orgName: 'ООО Наша Компания',
        priceWithVat: 88000,
        place: 1,
        isWin: true,
        isRejected: false,
        cancelReason: '',
      },
      {
        id: 602,
        createdAt: '2026-08-13T09:45:00+03:00',
        contactName: 'Конкурент',
        contactPhone: '+79160001122',
        orgId: 61,
        orgInn: '1600000001',
        orgName: 'ООО ВолгаТранс',
        priceWithVat: 90000,
        place: 2,
        isWin: false,
        isRejected: false,
        cancelReason: '',
      },
    ],
  },
]
