# i-React utils

[![Build Status](https://travis-ci.org/m-szalik/i-react-utils.svg?branch=master)](https://travis-ci.org/m-szalik/i-react-utils)

## Components:
React components.

### List
`import {List} from 'i-react-utils';`

```
<List data={dataObject see below} renderRow={function(item,index,reactRowKey) { return (<tr key={reactRowKey}>...</tr>);}}>
    (Optional table elements thead or tfoot)
</List>
```

Where:
 * **data** can be one of:
   * { items: arrayOfData, paging: {count: numItemsOn, total:numOfTotalItems, page:currentPageNumber} }
   * Array of items
 * **renderRow** = function that returns &lt;tr&gt; component for each element of data.

**Methods:**
 * `void data(dataObject); // see above`

### AjaxList
`import {AjaxList} from 'i-react-utils';`

```
<AjaxList
    renderRow={function(item,index,reactRowKey) { return (<tr key={reactRowKey}>...</tr>); }}
    onError={function(err) {}},
    fetchDataCallback={function(pageNum) {}}
    >
    (Optional table elements thead or tfoot)
</AjaxList>
```

Where:
 * **fetchDataCallback** is a function that return Promise of ajax request. Argument pageNum is one-indexed.
 * **renderRow** = function that returns &lt;tr&gt; component for each element of data.

**Methods:**
 * `void updateAndResetPage()`
 * `void update()`

### FormWizard
`import {fw} from 'i-react-utils';`
TODO


### GlobalMessage
`import {GlobalMessage} from 'i-react-utils';`

This component should wrap a page content.

```
<GlobalMessage>{ this.props.children }</GlobalMessage>
```

Usage:
```
class Page extends React.Component {
    static contextTypes = {
        messenger : React.PropTypes.object
    };

    onError(error) {
        this.context.messenger.clear();
        this.context.messenger.error('Error ' + error);
    }
}
```

## Utils and helpers:

`import {isEmptyObject, isNotBlank, setObjProperty, getObjProperty, isValidNIP, isValidREGON, isValidEmail} from 'i-react-utils';`

`bool isEmptyObject(object)`
`bool isNotBlank(string)`
`void setObjProperty(obj, propertyPath, value)`
`object getObjProperty(obj, propertyPath)`


`bool isValidNIP(string)`
`bool isValidREGON(string)`
`bool isValidEmail(string)`