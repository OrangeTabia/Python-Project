import OpenModalButton from "../modals/OpenModalButton/OpenModalButton";
import EditExpenseModal from "../modals/EditExpenseModal";
import { centsToUSD } from "../../utils/formatters";
import "./ExpensesList.css";

import DeleteFriendsExpenseModal from "../modals/DeleteFriendsExpenseModal";
import AddComment from "../Comments/AddComment";
import { useSelector } from "react-redux";
// import { useEffect } from "react";



function ExpenseCard({ expenseId }) {
  const currUser = useSelector(state => state.session.user)

  const expense = useSelector(state => state.friendsExpenses[parseInt(expenseId)])
  const payments = useSelector(state => Object.values(state.payments))
  // const [amountDue, setAmountDue] = useState('')

  // useEffect(() => {
  //   const currPayments = payments.filter(payment => payment.userId === currUser.id && payment.expenseId === expenseId)
  //   let total = 0;

  //   currPayments.forEach(payment => total += payment.amount)
  //   let adjustTotal = (expense.amount - total).toString()
  //   let due = '$' + adjustTotal.slice(0, -2) + '.' + adjustTotal.slice(-2)
  //   setAmountDue(due)

  // }, [])

  const whatsLeftToPay = (expense) => {
    const currPayments = payments.filter(payment => payment.expenseId === expense.id)
    let total = 0;

    currPayments.forEach(payment => total += payment.amount)
    let adjustTotal = (expense.amount - total).toString()
    return centsToUSD(adjustTotal)
  }

  return (
    <div className="expense-details-card">
      <div className="details-header">
        {expense.receiverId !== currUser.id
          ? <div className="owed-or-still-owe">
              <div >{`Total: ${centsToUSD(expense.amount)}`}</div>
              {expense.settled ? `This expense is all paid up` : `You still owe: ${whatsLeftToPay(expense)}`}
            </div>
          :  <div className="owed-or-still-owe-container">
                <div className="owed-or-still-owe">
                    <div>{`Total: ${centsToUSD(expense.amount)}`}</div>
                    {expense.settled ? `This expense is all paid up` : `You are owed: ${whatsLeftToPay(expense)}`}
                </div>
                <div id='expense-set-by-you'>
                  <div className="expense-set-by-you-delete">
                      <OpenModalButton
                        id="edit-expense-modal-button"
                        // className="modal-button"
                        buttonText="Edit Expense"
                        modalComponent={<EditExpenseModal expense={expense} />}
                      />
                  </div>
                  <div>
                      <OpenModalButton
                        id="delete-expense-modal-button"
                        buttonText='Delete Expense'
                        modalComponent={<DeleteFriendsExpenseModal expense={expense} />}
                      />
                  </div>
                </div>

            </div>
          }
      </div>
      <br></br>
        {expense.comments ? <div className="comments-card">
          <AddComment comments={expense.comments} expense={expense}/>
        </div>
        : '' }

    </div>

  );
}

export default ExpenseCard;
