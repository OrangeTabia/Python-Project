import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkUpdateFriendsExpense } from "../../../redux/friends_expenses";

function EditExpenseModal({ expense }) {
  const dispatch = useDispatch();
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [notes, setNotes] = useState(expense.notes);
  const [validations, setValidations] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const payer = useSelector((state) => state.friends)[expense.payerId];
  const { closeModal } = useModal();

  useEffect(() => {
    const frontValidations = {};
    if (!description)
      frontValidations.description =
        "A brief description of the expense is required";
    if (description.length > 200)
      frontValidations.description =
        "Description must be less than 200 characters";
    if (!amount || amount <= 0)
      frontValidations.amount = "Expense must have a minimum of $0.01";
    if (!expenseDate)
      frontValidations.expenseDate = "Please enter a date for the expense";
    if (notes.length > 200)
      frontValidations.notes = "Note must be less than 200 characters";

    setValidations(frontValidations);
  }, [description, amount, expenseDate, notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newDate = new Date(expenseDate);

    setHasSubmitted(true);

    const updatedExpense = {
      payerId: expense.payerId,
      receiverId: expense.receiverId,
      description,
      amount,
      expenseDate: newDate,
      settled: false,
      notes,
    };

    await dispatch(thunkUpdateFriendsExpense(expense.id, updatedExpense));
    closeModal();
  };

  return (
    <>
      <h2>Edit an expense</h2>
      <form onSubmit={handleSubmit} id="edit-expense-form">
        <div>
          <h3>With You and: {payer.name}</h3>
          <div className="form-label">
            <input
              id="description"
              type="text"
              value={description}
              placeholder="Enter a description"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {validations.description && hasSubmitted && (
              <span className="form-error">{validations.description}</span>
            )}
          </div>
          <div className="form-label">
            <input
              id="amount"
              type="text"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {validations.amount && hasSubmitted && (
              <span className="form-error">{validations.amount}</span>
            )}
          </div>
          <div className="form-label">
            <input
              id="expense_date"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
            {validations.expenseDate && hasSubmitted && (
              <span className="form-error">{validations.expenseDate}</span>
            )}
          </div>
          <div className="form-label">
            <input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {validations.notes && hasSubmitted && (
              <span className="form-error">{validations.notes}</span>
            )}
          </div>

          <div>
            <button className="form-cancel" onClick={closeModal}>
              Cancel
            </button>
            <button className="form-submit">Save</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default EditExpenseModal;