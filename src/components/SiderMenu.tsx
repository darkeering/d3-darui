import { Menu, MenuProps } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../withRouter";

class SiderMenu extends Component<any, any> {
  items = [
    {
      label: <Link to={"/"}>SimpleBar</Link>,
      key: "/",
    },
    {
      label: <Link to={"/SimpleLine"}>SimpleLine</Link>,
      key: "/SimpleLine",
    },
    {
      label: <Link to={"/SimpleLineii"}>SimpleLineii</Link>,
      key: "/SimpleLineii",
    },
    {
      label: <Link to={"/GroupBar"}>GroupBar</Link>,
      key: "/GroupBar",
    },
    {
      label: <Link to={"/ChinaMap"}>ChinaMap</Link>,
      key: "/ChinaMap",
    },
    {
      label: <Link to={"/SimpleArea"}>SimpleArea</Link>,
      key: "/SimpleArea",
    },
    {
      label: <Link to={"/SimplePie"}>SimplePie</Link>,
      key: "/SimplePie",
    },
    {
      label: <Link to={"/SimpleRing"}>SimpleRing</Link>,
      key: "/SimpleRing",
    },
    {
      label: <Link to={"/SimpleTree"}>SimpleTree</Link>,
      key: "/SimpleTree",
    },
    {
      label: <Link to={"/SimplePoints"}>SimplePoints</Link>,
      key: "/SimplePoints",
    },
  ];
  constructor(props: any) {
    super(props);
    this.state = {
      current: this.props.location.pathname || "home",
    };
  }
  onClick: MenuProps["onClick"] = (e) => {
    this.setState({ current: e.key });
  };
  render() {
    const { current } = this.state;
    return (
      <Menu
        onClick={this.onClick}
        style={{ width: 256 }}
        selectedKeys={[current]}
        mode="inline"
        items={this.items}
      />
    );
  }
}

export default withRouter(SiderMenu);
