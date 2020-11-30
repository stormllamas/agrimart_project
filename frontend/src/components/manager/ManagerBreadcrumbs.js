import React from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';

const Topbar = () => {
  const history = useHistory()

  return (
    <div className="manager-breadcrumb">
      <div className="row flex middle">
        <div className="col s6 m3 p-0">
          <Link to="/order_manager/unprocessed" className="p-3 light-blue lighten-1 white-text flex-col center full-width">Unclaimed</Link>
        </div>
        <div className="col s6 m3 p-0">
          <Link to="/order_manager/processed" className="p-3 amber white-text flex-col center full-width">Claimed</Link>
        </div>
        <div className="col s6 m3 p-0">
          <Link to="/order_manager/undelivered" className="p-3 orange white-text flex-col center full-width">Undelivered</Link>
        </div>
        <div className="col s6 m3 p-0">
          <Link to="/order_manager/delivered" className="p-3 light-green white-text flex-col center full-width">Delivered</Link>
        </div>
      </div>
    </div>
  )
}

export default (Topbar);