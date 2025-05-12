import React from 'react'

import { Link } from 'react-router'

import sortSessionsByTime from '../../utils/sortSessionsByTime'
import formatFirebaseTimestamp from '../../utils/formatFirebaseTimestamp'

const SessionsList = ({ sessions }) => {
  return (
    <ul className="sessions__list">
            {sortSessionsByTime(sessions).map((session) => (
              <li key={session.id}>
                <Link to={session.id} className="session-card card--blue">
                  <h2 className="session-card__title">
                    {session.metadata.title}
                  </h2>
                  <div className="session-card__metadata-container">
                    <div className="session-card__metadata-left">
                      <p className="session-card__metadata">
                        <span className="session-card__metadata-item">
                          Created
                        </span>
                        {formatFirebaseTimestamp(session.metadata.createdAt)}
                      </p>
                      <p className="session-card__metadata">
                        <span className="session-card__metadata-item">
                          Updated
                        </span>
                        {formatFirebaseTimestamp(session.metadata.updatedAt)}
                      </p>
                    </div>
                    <div className="session-card__metadata-right">
                      <p className="session-card__metadata">
                        {session.metadata.messageCount}
                        {session.metadata.messageCount === 1
                          ? " message"
                          : " messages"}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
  )
}

export default SessionsList