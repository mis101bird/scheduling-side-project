import React from 'react'

import { Link } from 'react-router-dom'

const view = () => (
  <div>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/login'>Login</Link></li>
      <li><Link to='/admin'>Admin</Link></li>
    </ul>
  </div>
)

export { view }
