import React from 'react'
import { Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
const LoaderWrap = ({active}) => (
		<Loader active={active}/>
	)

export const LoaderCon = connect(
		state => ({active: state.loaderActive})
	)(LoaderWrap)
