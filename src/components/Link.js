import React from 'react'
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation, useMutation } from 'urql'
import { FEED_QUERY } from './LinkList';
import gql from 'fraql';


const VOTE_MUTATION = gql`
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


const Link = ({index, link, location, match}) => {
  const [ res, executeMutation ] = useMutation(VOTE_MUTATION);
  const updateStoreAfterVote = (store, createVote, linkId) => {
    const isNewPage = location.pathname.includes('new')
    const page = parseInt(match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }
  const authToken = localStorage.getItem(AUTH_TOKEN)

  if (res.error) {
    console.log(res.error);
    return 'Oh no!';
  }

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) =>{updateStoreAfterVote(store, vote, link.id)}}>
            {( voteMutation ) => (
              <div className="ml1 gray f11" onClick={() => executeMutation({linkId: link.id})}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.desciption} ({link.url})
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

export default Link;