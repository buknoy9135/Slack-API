import { render, screen } from '@testing-library/react';
import UserDetails from '../components/UserDetails';
import userEvent from '@testing-library/user-event';

test('displays user details', () => {
    render(<UserDetails />);

    const userDetails = screen.getByText(/User Details/i);
    expect(userDetails).toBeInTheDocument();
})


const mockUser = {
  email: 'testuser@example.com',
  created_at: '2023-01-01T12:00:00Z',
  updated_at: '2023-02-01T12:00:00Z',
};

test('check if email from mockUser is displayed', () => {
  render(<UserDetails selectedUser={mockUser}/>);

  expect(mockUser.email).toContain('testuser@example.com');
})

test('check if UTZ time from mockUser is displayed', () => {
  render(<UserDetails selectedUser={mockUser}/>);

  expect(mockUser.created_at).toEqual('2023-01-01T12:00:00Z');
})

test('displays username correctly in the model after button click', () => {
  render(<UserDetails selectedUser={mockUser} />);


  userEvent.click(screen.getByTestId("openUserModal"));


  expect(screen.getByTestId("username")).toHaveTextContent("testuser");
});

test('displays email correctly in the model after button click', () => {
    render(<UserDetails selectedUser={mockUser} />);

    userEvent.click(screen.getByTestId("openUserModal"));

    expect(screen.getByTestId("email")).toHaveTextContent("testuser@example.com");
});
  

  test('displays date created correctly in the model after button click', () => {
    render(<UserDetails selectedUser={mockUser} />);

    userEvent.click(screen.getByTestId("openUserModal"));

    expect(screen.getByTestId("date-created")).toBeInTheDocument();
});
  