import { useState } from 'react'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'
import { Mutation as _Mutation, useMutation } from 'urql';
import gql from 'fraql';
import fnfy from 'fnfy';


const div = fnfy('div');
const input = fnfy('input');
const button = fnfy('button');
const Mutation = fnfy(_Mutation);


const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;


const CreateLink = ( history, store, post ) => {
  const [ description, setDescription ] = useState('');
  const [ url, setUrl ] = useState('');
  const [ res, executeMutation] = useMutation(POST_MUTATION);


  if (res.error) {
    console.log(res.error);
    return 'Oh no!';
  };


  const updateMutation = (store,  { data: { post } }) => {
    const first = LINKS_PER_PAGE
    const skip = 0
    const orderBy = 'createdAt_DESC'
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })
    data.feed.links.unshift(post)
    store.writeQuery({
      query: FEED_QUERY,
      data,
      variables: { first, skip, orderBy }
    })
  };


  return div({
    children: [
      div({
        className: 'flex flex-column mt3',
        children:[
          input({
            lassName: 'mb2',
            value: description,
            onChange:(e) => setDescription(e.target.value),
            type: 'text',
            placeholder: 'A description for the link'
          }),
          input({
            className: 'mb2',
            value: url,
            onChange: (e) => setUrl(e.target.value),
            type: 'text',
            placeholder: 'The URL for the link',
          })
        ]
      }),
      Mutation({
        mutation: POST_MUTATION,
        variables: { description, url },
        onCompleted: () => history.push('/new/1'),
        update: updateMutation(store, { data: { post } }),
        children: postMutation => button({
          onClick: () => executeMutation({}),
          children: 'Submit'
        }),
          
      })
    ]    
  })
};

export default CreateLink;