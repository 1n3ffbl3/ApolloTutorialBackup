import { useQuery } from 'urql';
import gql from 'fraql';
import fnfy from 'fnfy';
import _Link from './Link';


const div = fnfy('div');
const Link = fnfy(_Link);


export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;


const LinkList = ({ location, match }) => {
  const [ res ] = useQuery({
    query: FEED_QUERY,
  });


  if (res.fetching || !res.data) {
    return 'Loading...'
  } else if (res.error) {
    console.log(res.error);
    return 'Oh no!'
  };


  const links = res.data.feed.links;
  return div({
    children: [
      links.map(( link, index ) =>  (Link({
        key: index,
        link,
        location,
        match,
      })
      ))
    ]
  })
};


export default fnfy(LinkList);