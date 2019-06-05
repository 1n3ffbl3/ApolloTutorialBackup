import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';
import { timeDifferenceForDate } from '../utils';
import { Mutation as _Mutation, useMutation } from 'urql';
import { FEED_QUERY } from './LinkList';
import gql from 'fraql';
import fnfy from 'fnfy';


const div = fnfy('div');
const Mutation = fnfy(_Mutation);


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

  return div({
    className: 'flex mt2 items-start',
    children:[
      div({
        className: 'flex items-center',
        children: authToken && ( 
          Mutation({
            mutation: VOTE_MUTATION,
            variables: { linkId: link.id },
            update: (store, { data: { vote } }) => {
              updateStoreAfterVote(store, vote, link.id)},
            children: voteMutation => ( div({
              className: 'ml1 gray f11',
              onClick: () => executeMutation({linkId: link.id}),
              children:  '▲'
            }))
        }))
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
              link.length, ( 'votes | by  '),
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