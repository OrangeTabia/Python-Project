import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>
      <li style='margin: 20px;'>
        <a href='/api/friends'>Get all Friends</a>
      </li>
      <li style='margin: 20px;'>
        <a href='/api/friends_expenses'>Get all friends expenses</a>
      </li>
      <li style='margin: 20px;'>
        <a href='/api/payments'>Get all friends payments</a>
      </li>
    </ul>
  );
}

export default Navigation;
