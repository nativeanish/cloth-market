import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
const AddCloth = ({
  data,
}: {
  data: (
    name: string,
    image: string,
    price: number,
    quantity: number
  ) => Promise<void>;
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const isFormFilled = () => name && image && quantity && price;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Product</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Product name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name of product"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Price"
                onChange={(e) => {
                  setPrice(+e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputQuantity"
              label="Quantity"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Quantity"
                onChange={(e) => {
                  setQuantity(+e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              data(name, image, Number(price), Number(quantity));
              handleClose();
            }}
          >
            Save product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCloth;
