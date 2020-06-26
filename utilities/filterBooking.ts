import { MeQuery } from 'types/schema-types'

export type BookingCreatedInfo = {
  createdBooking: MeQuery['me']['bookings'] | undefined,
}

export const filterCreatedBooking = (bookings: MeQuery['me']['bookings']) => {
  const filterBooking = bookings.filter(booking => booking.status === 'CREATED')
  return filterBooking.length !== 0 ? filterBooking : undefined
}

export const bookingCreatedInfo = (loggedInUser: MeQuery['me'] | Object): BookingCreatedInfo => {
  const isMeAvaible = Object.keys(loggedInUser).indexOf('me') >= 0
  const filter = isMeAvaible ? filterCreatedBooking((loggedInUser as MeQuery).me.bookings) : null

  return {
    createdBooking: filter ? filter[0] : undefined as any
  }
}
