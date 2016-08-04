# angular-content-holder

Create multiple replaceable content holders in your main markup layout and enable other views to _fill in_ these sections at runtime. 

Inspired from and comparable to the ASP.NET MVC `@section` and `@RenderSection` functionality. 

## Usage

Define some `content-view` elements in you main layout:

```
<body>
    <!-- content view 1 -->
    <div content-view="view-header"></div>
  
    <!-- some routing mechanism -->
    <div ng-view></div>
    
    <div content-view="view-footer"></div>
</body>
```

Provide the content from the markup within other views with `content-holder` elements:

```
<div content-holder="view-header">
    <h1>My Header</h1>
    <p>Some {{ interpolated }} values</p>
</div>

<div content-holder="view-footer">
    <ul>
        <li ng-repeat="item in items">{{ item }}</li>
    </ul>
</div>
```