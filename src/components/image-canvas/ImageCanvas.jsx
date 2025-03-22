import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {addComment, addReply, deleteComment} from "../../redux/slices/commentSlice";
import styles from "./ImageCanvas.module.css";

const ImageCanvas = ({ image }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments[image.id]) || [];
  // State for comment popup
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, text: "" });
  const [replyData, setReplyData] = useState(null); // Stores which comment is being replied
  const [highlightedMarkerId, setHighlightedMarkerId] = useState(null);
  const [highlightedSidebarCommentId, setHighlightedSidebarCommentId] = useState(null);

  if (!image) return null;

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // X position relative to image
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Y position relative to image
    setPopup({ visible: true, x, y, text: "" });
  };

  const handleCommentSubmit = () => {
    if (!popup.text.trim()) return;
    let comment = {
      imageId: image.id,
      text: popup.text,
      position: { x: popup.x, y: popup.y },
    };
    dispatch(addComment(comment));
    setPopup({ visible: false, x: 0, y: 0, text: "" });
  };



  const handleMarkerClick = (comment) => {
    setReplyData({
      commentId: comment.id,
      visible: true,
      x: comment.position.x,
      y: comment.position.y,
      text: "",
    });

    sidebarCommentHighlight(comment)
  };

  const sidebarCommentHighlight = (comment)=>{
    setHighlightedSidebarCommentId(comment.id); // Highlight selected Marker's Sidebar Comment 
    // Scroll to the Selected Sidebar Comment
    const sidebarComment = document.getElementById(`sidebar-${comment.id}`);
    if (sidebarComment) {
      sidebarComment.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Remove the Highlight after 2 seconds
    setTimeout(() => {
      setHighlightedSidebarCommentId(null);
    }, 2000);
  }

  const handleReplySubmit = (commentId) => {
    if (!replyData.text.trim()) return;
    dispatch(addReply({ imageId: image.id, commentId, text: replyData.text }));
    setReplyData(null);
  };



  const handleSidebarClick = (comment) => {
    setHighlightedMarkerId(comment.id); // Highlight marker
    // Scroll to the marker
    const markerElement = document.getElementById(`marker-${comment.id}`);
    if (markerElement) {
      markerElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Remove highlight after 2 seconds
    setTimeout(() => {
      setHighlightedMarkerId(null);
    }, 2000);
  };

  return (
      <section className={styles.canvasContainer}>
        <figure className={styles.imageCont}>
          <img
            src={image.url}
            alt="Annotated"
            className={styles.image}
            onClick={handleImageClick}
          />


          {/* Rendering Comment Markers */}
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              id={`marker-${comment.id}`}
              className={`${styles.marker} ${highlightedMarkerId === comment.id ? styles.highlight : ""}`}
              style={{
                left: `${comment.position.x}%`,
                top: `${comment.position.y}%`,
              }}
              onClick={() => {
                handleMarkerClick(comment);
              }}
            >
              {index + 1}
            </div>
          ))}


          {/* Comment Input Popup */}
          {popup.visible && (
            <div
              className={styles.commentPopup}
              style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
            >
              <textarea
                value={popup.text}
                onChange={(e) => setPopup({ ...popup, text: e.target.value })}
                placeholder="Add a comment..."
              />
              <div>
                <button onClick={handleCommentSubmit}>Submit</button>
                <button
                  onClick={() =>
                    setPopup({ visible: false, x: 0, y: 0, text: "" })
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          )}


          {/* Reply Input Popup */}
          {replyData && (
            <div
              className={styles.commentPopup}
              style={{
                left: `calc(${replyData.x}% + 117px)`,
                top: `calc(${replyData.y}% + 172px)`,
              }}
            >
              <textarea
                value={replyData.text}
                onChange={(e) =>
                  setReplyData({ ...replyData, text: e.target.value })
                }
              />
              <button onClick={() => handleReplySubmit(replyData.commentId)}>
                Reply
              </button>
              <button onClick={() => setReplyData(null)}>Cancel</button>
            </div>
          )}
        </figure>


        {/* Sidebar for Comments */}
      <section className={styles.sidebar}>
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              id = {`sidebar-${comment.id}`}
              className={`${styles.commentItem} ${highlightedSidebarCommentId === comment.id ? styles.highlightSidebarComment : ""}`}
              onClick={() => handleSidebarClick(comment)}
            >
              <p>
                <strong>Comment:</strong> {comment.text}
              </p>
              <button
                onClick={(e) =>{
                  e.stopPropagation() ;
                  dispatch(deleteComment({ imageId: image.id, commentId: comment.id })) ;
                 }
                }
              >
                Delete
              </button>
              {comment.replies.length > 0 && (
                <div className={styles.replies}>
                  {comment.replies.map((reply, index) => (
                    <p key={reply.id} className={styles.reply}>
                      <span>{reply.text}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
      </section>
  );
};

export default ImageCanvas;
