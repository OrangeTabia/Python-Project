import OpenModalButton from "../modals/OpenModalButton/OpenModalButton";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAddComment } from "../../redux/friends_expenses";
import EditComment from "./EditComment";
import DeleteComment from "./DeleteComment";
import "./Comments.css";
import { HiOutlineX } from "react-icons/hi";
import { TfiPencilAlt } from "react-icons/tfi";
import { FaComment } from "react-icons/fa6";

function AddComment({ comments, expense }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState("");
  // const [hasSubmitted, setHasSubmitted] = useState("");

  const friendsFlattened = useSelector((state) => state.friends);
  const friends = Object.values(friendsFlattened);
  const currentUser = useSelector((state) => state.session.user);

  console.log("EXPENSE", expense);

  useEffect(() => {
    const errors = {};
    if (comment.length > 200)
      errors.comment = "Comment must be less than 200 characters";
    setErrors(errors);
  }, [comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setHasSubmitted(true);

    const newComment = {
      userId: currentUser.id,
      friendsExpenseId: expense.id,
      comment,
    };

    await dispatch(thunkAddComment(newComment));
    setComment("");
  };

  return (
    <>
      <div id="comments-and-notes-title"><FaComment /> NOTES AND COMMENTS</div>
      {expense.notes ? 
      <div id="existing-note">
        <label id="note-label">Notes</label>
        <div id="expense-note">{expense?.notes}</div>
      </div>
      : '' }

      
      <div id="existing-and-new-comments">
        {expense.comments.length ? 
        <div id="existing-comments">
          {comments &&
            comments.map((comment) => (
              <div key={comment.id}>
                <div id="comment-name-date-buttons">
                  <div id="name-and-date">
                  {comment.userId === currentUser.id
                    ? currentUser.name
                    : friends?.find((friend) => friend.id === comment?.userId)
                        ?.name}
                        <span id="comment-createdAt"> - {comment.createdAt}</span>
                  </div>
                  <div id="comment-edit-delete-btns">
                  <OpenModalButton
                    id="edit-expense-modal-button"
                    buttonText={<TfiPencilAlt style={{fontSize: '19px'}}/>}
                    modalComponent={
                      <EditComment comments={comment} expense={expense} />
                    }
                  />
                  <OpenModalButton
                    id="delete-expense-modal-button"
                    buttonText={<HiOutlineX style={{fontSize: '19px'}}/>}
                    modalComponent={<DeleteComment comments={comment} />}
                  />
                </div>
                </div>
                <div id="comment">
                  {comment.comment}
                </div>
                <div id="comment-edit-delete">
                </div>
              </div>
            ))}
        </div>
        : '' }
        <div id="new-comment">
          <div className="form-label">
            <form onSubmit={handleSubmit} id="add-comment-form">
              <textarea
                id="comment-box"
                rows="3"
                cols="45"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {errors.comment ?
                <span className="form-error">{errors.comment}</span> :
                '' }
              <br></br>
              <p className="char-count"
              >{comment && comment.length <= 200
                  ? `You have ${200 - comment.length} characters left`
                  : ``}</p>
              <button disabled={!comment || errors.comment} className="form-submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddComment;
