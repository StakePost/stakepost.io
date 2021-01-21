import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import { makeStyles } from "@material-ui/core/styles";

import { MessageCard } from "../messageCard";

import { fetchPosts, postsSelector } from "../../store/slices/posts";

export function MessageList() {
  const dispatch = useDispatch();
  const { count, offset, limit, entities } = useSelector(postsSelector);

  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchPosts(offset, limit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = () => {
    dispatch(fetchPosts(offset + limit, limit));
  };

  const hasMore = entities.length < count;

  const renderPosts = () => {
    return entities.map((post) => {
      const { content, ...rest } = post;
      return (
        <MessageCard key={post._id} {...rest}>
          {content}
        </MessageCard>
      );
    });
  };

  return (
    <div className={classes.root}>
      <InfiniteScroll
        dataLength={entities.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div>Loading...</div>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {renderPosts()}
      </InfiniteScroll>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
