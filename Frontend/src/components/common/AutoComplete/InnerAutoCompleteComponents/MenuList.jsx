// @flow

import React, { Component } from 'react';

import { List } from 'react-virtualized';
import NoOptionsMessage from './NoOptionsMessage';

class MenuList extends Component<*> {
    calculateListHeight = ({ childrenArray }: *) => {
        const { maxMenuHeight = 350 } = this.props.selectProps;

        return childrenArray.reduce(result => (result >= maxMenuHeight ? maxMenuHeight : result + 50), 0);
    };

    render() {
        const { children, selectProps: { maxMenuWidth = 350 } } = this.props;
        const childrenArray = React.Children.toArray(children);
        const height = this.calculateListHeight({ childrenArray });

        return (
            children.length
                ? (<List
                    width={maxMenuWidth}
                    height={height}
                    rowCount={childrenArray.length}
                    rowHeight={50}
                    rowRenderer={({
                        key, index, style,
                    }) => (
                        <div
                            key={key}
                            style={style}
                        >
                            {children[index]}
                        </div>
                    )
                    }
                />
                ) : <NoOptionsMessage {...this.props} />

        );
    }
}

export default MenuList;
