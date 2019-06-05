import { useState } from 'react';
import gql from 'graphql-tag';
import _Link from './Link';
import fnfy from 'fnfy';


const div = fnfy('div');
const Link = fnfy(_Link);
const input = fnfy('input');
const button = fnfy('button');


const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
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
    }
  }
`;

const Search = ({ client }) => {

  const [ links, setLinks ] = useState([]);
  const [ filter, setFilter ] = useState('');

  const _executeSearch = async (client) => {
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    setLinks({ links })
  }
  
  return div({
    children: [
      div({
        children: [
          'Search',
          input({
            type: 'text',
            onChange: (e) => setFilter(e.target.value)}),
          button({
            onClick: () => _executeSearch(),
            children: 'OK'
          })
        ]
      }),
      div({
        children: [
          links.map(( link, index ) => (Link ({
            key: link.id,
            link,
            index,
          })))
        ]
      })
    ]
  })
};


export default fnfy(Search);