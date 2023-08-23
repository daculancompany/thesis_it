
import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © Thesis IT 2022, powered with
            {<HeartFilled />} by
            &nbsp;<b><a  href="https://www.facebook.com/niel.daculan" target="new" >Developer Site</a> </b>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
