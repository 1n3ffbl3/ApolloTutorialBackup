import React from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation, useMutation } from 'urql'


const VOTE_MUTATION = `
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`


const Link = (index, link, description, updateStoreAfterVote ) => {
  const [ res, executeMutation ] = useMutation(VOTE_MUTATION);
  const authToken = localStorage.getItem(AUTH_TOKEN)
  
  console.log('link.votes', link.votes)
  console.log('link:', link);
  console.log('link.postedBy:', link.postedBy);
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) =>
              updateStoreAfterVote(store, vote, link.id)
            }>
            {voteMutation => (
              <div className="ml1 gray f11" onClick={() => executeMutation({linkId: link.id})}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.length} votes | by{' '}
          {link.postedBy
            ? link.postedBy.name
            : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  )
}

export default Link