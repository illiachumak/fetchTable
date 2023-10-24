import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import { fetchTableData, createTableRow, updateTableRow, deleteTableRow, TableRow } from '../redux/slices/tableSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks';
import { setCurrentPage } from '../redux/slices/tableSlice';
import { logOut } from '../redux/slices/loginSlice';
import meme1 from '../img/meme1.jpg'
import meme2 from '../img/meme2.jpg'
const TablePage: React.FC = () => {

    const dispatch = useAppDispatch();
    const tableData = useAppSelector(state => state.table.data);
    const loading = useAppSelector(state => state.table.loading);
    const error = useAppSelector(state => state.table.error);
    const currentPage = useAppSelector(state => state.table.currentPage);
    const limit = useAppSelector(state => state.table.limit);

    const [formError, setFormError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<number | null>(null);

    const handleDeleteConfirmation = (id: number) => {
        setRowToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (rowToDelete) {
            dispatch(deleteTableRow(rowToDelete));
        }
        setDeleteModalOpen(false);
        setRowToDelete(null);
    };

    const handleAddInformation = () => {
        setSelectedRow(null); 
        setModalOpen(true);
    };

    useEffect(() => {
      dispatch(fetchTableData({ currentPage }));
    }, [dispatch, currentPage, limit]);

    const handleEdit = (row: TableRow) => {
        setSelectedRow(row);
        setModalOpen(true);
    };

    const handleSubmit = () => {
    if (!selectedRow?.name || !selectedRow?.email || !selectedRow?.birthday_date || !selectedRow?.phone_number) {
        setFormError('Please fill all required fields.');
        return;
    }
    if (selectedRow) {
        if (selectedRow.id) {
            dispatch(updateTableRow(selectedRow));
        } else {
            dispatch(createTableRow(selectedRow));
        }
    }
    setModalOpen(false);
    setSelectedRow(null);
};

return (
  <div className="m-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="primary" onClick={handleAddInformation}>
                Add Information
            </Button>
            <Button variant="danger" onClick={() => {
              dispatch(logOut())
            }}>
                Log out
            </Button>
        </div>

      {loading === 'pending' ? (
          <p>Loading...</p>
      ) : (
          <>
              <Table striped bordered hover className="mb-3">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Birthday Date</th>
                          <th>Phone Number</th>
                          <th>Address</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {tableData.map(row => (
                          <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>{row.name}</td>
                              <td>{row.email}</td>
                              <td>{row.birthday_date}</td>
                              <td>{row.phone_number}</td>
                              <td>{row.address || '-'}</td>
                              <td>
                                  <Button className='m-1' onClick={() => handleEdit(row)}>Edit</Button>
                                  <Button variant="danger" onClick={() => handleDeleteConfirmation(row.id!)}>Delete</Button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </Table>
              
              <div className="d-flex justify-content-center mb-3">
                  <Pagination>
                      <Pagination.First onClick={() => dispatch(setCurrentPage(1))} />
                      <Pagination.Prev onClick={() => dispatch(setCurrentPage(currentPage - 1))} />
                      <Pagination.Next onClick={() => dispatch(setCurrentPage(currentPage + 1))} />
                  </Pagination>
              </div>
              
              <Modal show={isDeleteModalOpen} onHide={() => setDeleteModalOpen(false)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Confirm Deletion</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you sure you want to delete this row?</Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                          Cancel
                      </Button>
                      <Button variant="danger" onClick={confirmDelete}>
                          Delete
                      </Button>
                  </Modal.Footer>
              </Modal>

              <Modal show={isModalOpen} onHide={() => setModalOpen(false)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Information</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => {
                          setModalOpen(false);
                          setFormError(null); 
                      }}>
                          Close
                      </Button>
                      <Button variant="primary" onClick={handleSubmit} disabled={!!formError}>
                          Save Changes
                      </Button>
                  </Modal.Footer>
              </Modal>
              
          </>
      )}

      {error && <div className="error mt-3">{error}</div>}

      <div className="mt-5">
            <h3>About me</h3>
            <p>
                Я вивчаю веб розробку вже більше 1.5 роки, граю на гітарі та хожу в тренажерний зал. Веду повністю здоровий спосіб життя. Далі пару мемів
            </p>
            <img src={meme1} alt="meme" />
            <img src={meme2} alt="meme" />
        </div>
    </div>
);

};

export default TablePage;
