import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { CommentsBlock } from '../components/CommentsBlock';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { Link } from 'react-router-dom';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);

  const isPostsLoading = posts.status == 'loading';
  const isTagsLoading = tags.status == 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Link to={`/posts/${obj._id}`}>
                <Post
                  _id={obj._id}
                  key={index}
                  title={obj.title}
                  imageUrl={obj.imageUrl? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id && userData?._id == obj.user?._id}
                />
              </Link>
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Vasya Popovych',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'This is text comment',
              },
              {
                user: {
                  fullName: 'Slavik Sych',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
