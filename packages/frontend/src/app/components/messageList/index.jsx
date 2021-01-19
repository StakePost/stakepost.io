import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MessageCard } from "../messageCard";

import { fetchPosts, postsSelector } from "../../store/slices/posts";

export function MessageList() {
  const dispatch = useDispatch();
  const { entities, offset, limit, loading, error } = useSelector(
    postsSelector
  );

  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchPosts(offset, limit));
  }, [dispatch, offset, limit]);

  const renderPosts = () => {
    if (loading) return <CircularProgress />;
    if (error) return <p>{error}</p>;

    return entities.map((post) => {
      const { content, ...rest } = post;
      return (
        <MessageCard key={post._id} {...rest}>
          {content}
        </MessageCard>
      );
    });
  };

  return <div className={classes.root}>{renderPosts()}</div>;
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));
