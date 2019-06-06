import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';
import { timeDifferenceForDate } from '../utils';
import { useMutation } from 'urql';
import { FEED_QUERY } from './LinkList';
import gql from 'fraql';
import fnfy from 'fnfy';


const div = fnfy('div');


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
`;


const Link = ({index, link, location, match}) => {
  const [ res, executeMutation ] = useMutation(VOTE_MUTATION);
  if (res.error) {
    console.log(res.error);
    return 'Oh no!';
  }

  const authToken = localStorage.getItem(AUTH_TOKEN)

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

  
  if (!res.fetching && res.data) {
    const vote = res.data.vote;
    updateStoreAfterVote(store, vote, link.id);  // TODO: try to figure out how to pass store form query                                                           
  }                                              

  const voteCount = link.votes ? link.votes.length : 0;

  return div({
    className: 'flex mt2 items-start',
    children:[
      div({
        className: 'flex items-center',
        children: authToken && ( 
          div({
            className: 'ml1 gray f11',
            onClick: () => executeMutation({linkId: link.id}),
            children:  '▲'
          })  
        )
      }),
      div({
        className: 'ml1',
        children: [
          div({
            children: [link.description, (link.url)]
          }),
          div({
            className: 'f6 lh-copy gray',
            children:[
              link.length, ( `votes ${voteCount} | by ` ),
              (link.postedBy
              ? link.postedBy.name
              : 'Unknown '), 
              timeDifferenceForDate(link.createdAt)
            ]
          })
        ]
      })
    ]
  })
};


export default Link;