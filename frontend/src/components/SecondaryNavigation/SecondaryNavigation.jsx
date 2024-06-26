import "./SecondaryNavigation.css";
import OpenModalButton from "../modals/OpenModalButton/OpenModalButton";
import AddExpenseModal from "../modals/AddExpenseModal/AddExpenseModal";
import SettleUpModal from "../modals/SettleUpModal/SettleUpModal";

function SecondaryNavigation({ pageTitle, profileImage }) {
    return (
        <header id="secondary-nav-header">
            {profileImage ?
                <div className="title-with-profile-image">
                    <img className='profile-image' src={profileImage} />
                    <h1 id="page-title">{pageTitle}</h1>
                </div>
                 :
                <h1 id="page-title">{pageTitle}</h1>
            }
            <nav className="secondary-nav-nav">
              <div className="secondary-nav-buttons">
                <OpenModalButton
                  buttonText="Add Expense"
                  modalComponent={<AddExpenseModal />}
                  id="add-expense-modal-button"
                  // className="modal-button"
                  />
                  <OpenModalButton
                    buttonText="Settle Up"
                    modalComponent={<SettleUpModal />}
                    id="settle-up-modal-button"
                    // className="modal-button"
                  />
                </div>
              </nav>
          </header>
  );
}

export default SecondaryNavigation;
