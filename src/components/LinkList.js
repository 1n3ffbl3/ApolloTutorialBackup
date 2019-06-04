import React, { Fragment } from 'react';
import { useQuery } from 'urql';
import gql from 'fraql';


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


const  LinkList = () => {
  const [ res ] = useQuery({
    query: FEED_QUERY,
  })

  if (res.fetching || res.data == null) {
    return 'Loading...';
  }

  const fetchedData = res.data.feed.links;
  return (
    <Fragment>
      {fetchedData.map(link=> (
        <div className="ml1">
          <div>
             ({link.url})
          </div>
          <div className="f6 lh-copy gray">
            {link.length} votes | by{' '}
            {link.postedBy
            ? link.postedBy.name
            : 'Unknown'}{' '}
            {link.desciption} {(link.createdAt)}
        </div>
      </div>
      ))}
    </Fragment>
  );
}


export default LinkList