import Link from 'next/link'
import { LindaSalonIconWhite } from 'components/icons/linda-salon-icon'

const Logo = () => (
  <Link href="/" prefetch>
    <a className="logo-link">
      <LindaSalonIconWhite />
    </a>
  </Link>
)

export default Logo