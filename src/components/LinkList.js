import React, { Fragment } from 'react';
import Link from './Link';
import { Query } from 'urql';
import { LINKS_PER_PAGE } from '../constants';


export const FEED_QUERY = `
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


const NEW_LINKS_SUBSCRIPTION = `
  subscription {
    newLink {
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
`;


const NEW_VOTES_SUBSCRIPTION = `
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;


const  LinkList = ({ location, match, history }) => {

  const _updateCacheAfterVote = (store, createVote, linkId) => {
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


  const _subscribeToNewLinks = (subscribeToMore) => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;
  
        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  };


  const _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  };


  const _getQueryVariables = ({ location, match }) => {
    const isNewPage = location.pathname.includes('new')
    const page = parseInt(match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    console.log({ first, skip, orderBy });
    return { first, skip, orderBy }
  };


  const _getLinksToRender = data => {
    console.log('data', data);
    const isNewPage = location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }


  const _nextPage = data => {
    const page = parseInt(match.params.page, 10)
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      history.push(`/new/${nextPage}`)
    }
  }
  

  const _previousPage = () => {
    const page = parseInt(match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      history.push(`/new/${previousPage}`)
    }
  }
  // const ConsoleLog = (value) => { console.log('subscribeToMore', value); }

  return (
    <Query query={FEED_QUERY} variables={_getQueryVariables({ location, match })}>
      {({fetching, error, data}) => {
        console.log(fetching, error)
        if (fetching) return <div>Fetching</div>
        else if (error) return <div>Error</div>
        
        // ConsoleLog(subscribeToMore);
        // _subscribeToNewLinks(subscribeToMore);
        // _subscribeToNewVotes(subscribeToMore);

        const linksToRender = _getLinksToRender(data);
        const isNewPage = location.pathname.includes('new');
        const pageIndex = match.params.page
          ? (match.params.page - 1) * LINKS_PER_PAGE
          : 0;

        return (
          <Fragment>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={_updateCacheAfterVote}/>
            ))}
            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div className="pointer mr2" onClick={_previousPage}>
                  Previous
                </div>
                <div className="pointer" onClick={() => _nextPage(data)}>
                  Next
                </div>
              </div>
            )}
          </Fragment>
        )
      }}
    </Query>
  );
}


export default LinkList