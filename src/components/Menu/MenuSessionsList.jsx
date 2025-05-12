import React from 'react'

import { NavLink } from 'react-router'

import sortSessionsByTime from '../../utils/sortSessionsByTime'

const MenuSessionsList = ({sessions, loading, error, activeStyles, onClick}) => {
  return (
    <ul className="menu__list">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {sortSessionsByTime(sessions).map((session) => (
                  <li className="menu__item" key={session.id}>
                    <NavLink
                      className="menu__navlink"
                      to={`/sessions/${session.id}`}
                      style={({ isActive }) => (isActive ? activeStyles : null)}
                      onClick={onClick}
                    >
                      <div className="menu__list-item">
                        <span className="menu__list-name">
                          {session.metadata.title}
                        </span>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
  )
}

export default MenuSessionsList