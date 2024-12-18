import React from 'react';
import PropTypes from 'prop-types';

function Errors(props) {
  if (props.errorId) {
    return (
      <div className="error">
        <span className="cf-icon cf-icon-error icon-warning" />
        { 'We tried to load that definition, but something went wrong. ' }
        <a
          href={`#${props.errorId}`}
          className="update-definition inactive internal"
          data-definition={props.errorId}
        >
          Try again?
        </a>
      </div>
    );
  }
  return null;
}

Errors.propTypes = {
  errorId: PropTypes.string,
};

export default function Definitions(props) {
  return (
    <div>
      <header className={props.loading ? 'group spinner' : 'group'} >
        <h4>Defined Term</h4>
      </header>
      <Errors errorId={props.errorId} />
    </div>
  );
}

Definitions.propTypes = {
  loading: PropTypes.bool,
  errorId: PropTypes.string,
};
