import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ExpenseCard from "./ExpenseCard";
import { centsToUSD } from "../../utils/formatters";
import "./ExpensesList.css";

function ExpensesList() {
  // TODO: Sort expenses by date and insert month dividers
  // ... Separate expenses into arrays by month, then nest a loop?
  const [selectedExpense, setSelectedExpense] = useState("");
  const expenses = useSelector((state) => state.friendsExpenses);
  const currUser = useSelector(state => state.session.user)
  const allFriends = useSelector((state) => state.friends)
  const allPayments = useSelector((state) => state.payments)
  const [friendInvisible, setFriendInvisible] = useState(window.innerWidth < 800);



  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(min-width: 800px)');

  //   const removeFriendSection = (e) => {
  //     setFriendInvisible(!e.matches)
  //   }
  //   removeFriendSection(mediaQuery);

  //   mediaQuery.addEventListener('change', removeFriendSection);
  //   return () => {
  //     mediaQuery.removeEventListener('change', removeFriendSection)
  //   }

  // }, [])



  const handleClick = (expenseId) => {
    if (selectedExpense === expenseId) setSelectedExpense("")
    else setSelectedExpense(expenseId);
  };

  const getCurrFriend = (expense) => {
    let currFriend;
    if (expense.receiverId === currUser.id) {
      currFriend = Object.values(allFriends).find(friend => friend.id === expense.payerId)
    }
    if (expense.payerId === currUser.id) {
      currFriend = Object.values(allFriends).find(friend => friend.id === expense.receiverId)
    }
    return currFriend.name
  }

  const whatsLeftToPay = (expense) => {
    const currPayments = Object.values(allPayments).filter(payment => payment.expenseId === expense.id)
    let total = 0;

    currPayments.forEach(payment => total += payment.amount)
    let adjustTotal = (expense.amount - total).toString()
    return centsToUSD(adjustTotal)
  }


  return (
    <section id="expenses-list-container">
      {Object.values(expenses).length
        ? <div>
        {Object.values(expenses).map((expense) => (
          <div key={expense.id} className='all-expenses' >
            <div
              onClick={() => handleClick(expense.id)}
              className="expense-container"
            >
              <div >{expense.description}</div>
              {!expense.settled
                      ? <div className={expense.payerId === currUser.id
                        ? 'all-expenses-payer'
                        : 'all-expenses-receiver'}
                        >
                          {expense.receiverId === currUser.id
                            ? `${getCurrFriend(expense)} still owes you: `
                            : `You still owe ${getCurrFriend(expense)}: `}{whatsLeftToPay(expense)}
                        </div>
                      : <div hidden={!expense.settled}>Expense Settled</div> }
              <div >{centsToUSD(expense.amount)}</div>
            </div>
            {selectedExpense === expense.id && <ExpenseCard expenseId={expense.id} />}
          </div>
        ))}
      </div>
      : <div className='no-expenses' >No current or past expenses</div>
      }
    </section>

  );
}

export default ExpensesList;
