import React from 'react'

import { Link } from 'react-router'

import sortSessionsByTime from '../../utils/sortSessionsByTime'
import formatFirebaseTimestamp from '../../utils/formatFirebaseTimestamp'

const SessionsList = ({ sessions }) => {
  return (
    <ul className="sessions__list">
            {sortSessionsByTime(sessions).map((session) => (
              <li key={session.id}>
                <Link to={session.id} className="session-card bg-gray-900/10 dark:bg-gray-100/10 rounded-xl">
                  <h2 className="session-card__title text-sky-900 dark:text-sky-400">
                    {session.metadata.title}
                  </h2>
                  <div className="session-card__metadata-container">
                    <div className="session-card__metadata-left">
                      <p className="session-card__metadata text-neutral-900 dark:text-neutral-100">
                        <span className="session-card__metadata-item text-sky-900 dark:text-sky-400">
                          Created
                        </span>
                        {formatFirebaseTimestamp(session.metadata.createdAt)}
                      </p>
                      <p className="session-card__metadata text-neutral-900 dark:text-neutral-100">
                        <span className="session-card__metadata-item text-sky-900 dark:text-sky-400">
                          Updated
                        </span>
                        {formatFirebaseTimestamp(session.metadata.updatedAt)}
                      </p>
                    </div>
                    <div className="session-card__metadata-right">
                      <p className="session-card__metadata text-neutral-900 dark:text-neutral-100">
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