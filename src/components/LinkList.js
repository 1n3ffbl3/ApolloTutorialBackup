import React, { Fragment } from 'react';
import { useQuery, Query } from 'urql';
import gql from 'fraql';
import fnfy from 'fnfy';
import Link from './Link';


const div = fnfy('div');

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


const LinkList = ({location, match}) => {
  const [ res ] = useQuery({
    query: FEED_QUERY,
  })

  if (res.fetching || !res.data) {
    return 'Loading...'
  } else if (res.error) {
    console.log(res.error);
    return 'Oh no!'
  }

  const links = res.data.feed.links;
  return (
    <div>
      {
        links.map(( link, index ) => {
          return (
            <Link link={link} location={location} match={match} />
          )
        })
      }
    </div>
  )
};


export default LinkList