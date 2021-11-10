import React from 'react'
import FormGroup from './FormGroup'
import InputGroup from './InputGroup'

function RegisterForm() {
    return (
        <>
        <FormGroup className="flex">
        <input id="register_first_name" type="text"  name="first_name" placeholder="First" className="mr-6 w-full border border-gray-300 rounded-sm px-4 py-3 outline-none transition-colors duration-150 ease-in-out focus:border-green-400" required/>
        <input id="register_last_name" type="text"  name="last_name" placeholder="Last" className="w-full border border-gray-300 rounded-sm px-4 py-3 outline-none transition-colors duration-150 ease-in-out focus:border-green-400" required/>
      </FormGroup>
      <FormGroup>
        <InputGroup
          type="text"
          name="username"
          placeholder="Choose username" required
        />
      </FormGroup>
      <FormGroup>
        <InputGroup
          type="email"
          name="email"
          placeholder="Email" required
        />
      </FormGroup>
      <FormGroup>
        <InputGroup 
          type="password"
          name="password"
          placeholder="Password" required
        />
      </FormGroup>
      </>
    )
}

export default RegisterForm
