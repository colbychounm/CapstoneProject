import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useLazyQuery, useMutation } from '@apollo/client';

import './CheckoutPage.css';
import { GET_CUSTOMER } from '../../data/queries/get-customer';
import { MUTATION_CUSTOMER } from '../../data/mutations/update-customer';

const CustomerForm = ({ setIsLocationUpdate }) => {
    const [queryCustomer, { data }] = useLazyQuery(GET_CUSTOMER);
    const [updateCustomer] = useMutation(MUTATION_CUSTOMER);

    useEffect(() => {
        queryCustomer({
            variables: { customerCustomerId2: "Chau" }
        })
    }, [])

    let customerName, customerLocation;

    if (data) {
        customerName = data.customer.name;
        customerLocation = data.customer.location
    }
    return data ? (<div>
        <div className='checkout-form__logo'>
            <img alt='Logo' src='https://cdn.shopify.com/s/files/1/0098/0202/2971/files/cg-toecap-checkout-logo.png?16596' />
        </div>
        <h4 className='checkout-form__title'>Contact information</h4>
        <Formik
            initialValues={{ name: `${customerName}`, location: `${customerLocation}` }}
            validate={values => {
                const errors = {};
                if (!values.name) {
                    errors.name = 'Required';
                } else if (values.name.length >= 50) {
                    errors.name = 'Full name must be less than 50 characters'
                } else if (!values.location) {
                    errors.location = 'Required';
                } else if (values.location.length >= 20) {
                    errors.location = "Location must be less than 20 characters"
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                updateCustomer({
                    variables: {
                        customer: {
                            customerId: "Chau",
                            name: `${values.name}`,
                            location: `${values.location}`
                        }
                    }
                })
                alert("Saved customer information!");
                setIsLocationUpdate(true)
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Field className="checkout-form__input" type="text" name="name" placeholder="Full name" />
                    <ErrorMessage className='checkout-form__error' name="name" component="div" />
                    <Field className="checkout-form__input" type="text" name="location" placeholder="Location" />
                    <ErrorMessage className='checkout-form__error' name="location" component="div" />
                    <button className='checkout-form__submit' type="submit" disabled={isSubmitting}>
                        Save
                    </button>
                </Form>
            )}
        </Formik>
    </div >
    )
        :
        <></>
};

export default CustomerForm;