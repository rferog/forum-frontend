import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import { IAllTopics } from 'components/AllTopics/types';
import { CustomButton } from 'components/Buttons';
import { ThemeContext } from 'themeContext';

const AllTopics: React.FC<IAllTopics> = (
  props: IAllTopics
): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  return(
    <React.Fragment>
      <div className={`topics-container-${theme}`}>
        <h4 className={`topic-cell-${theme}`}>
          {"All Topics"}
        </h4>
        {props.allTopics ? props.allTopics.map(topic =>
          <Link
            key={topic.id}
            className={`topic-cell-${theme}`}
            to={`/topic/${topic.id}`}
            onClick={props.offcanvasClose}
          >
              {topic.name}
          </Link>
        ) : <div className={`topic-cell-${theme}`}>
              {"No topics created yet"}
            </div>}
      </div>
      <CustomButton
        onClick={props.moreTopics}
        customStyle={"pagination-button"}
      >
        {"More topics"}
      </CustomButton>
    </React.Fragment>
  )
}

export { AllTopics }
