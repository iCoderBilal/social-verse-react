import React from 'react'
import FormGroup from './FormGroup'
import InputGroup from './InputGroup'

function LoginForm() {
    return (
        <>
        <FormGroup>
        <InputGroup
          type="text"
          name="mixed"
          placeholder="Your email or username" required
        />
      </FormGroup>
      <FormGroup>
        <InputGroup
          type="password"
          name="password"
          placeholder="Your password" required
        />
      </FormGroup>
      </>
    )
}

export default LoginForm
