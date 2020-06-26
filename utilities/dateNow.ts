import { format } from 'date-fns'

export default format(Date.now(), "YYYY-MM-DD") + "T00:00:00.000Z"