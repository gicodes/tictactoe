import { Children } from "react";

const AboutLayout = ({ children }) => {
  return (
    <div>
      <h1>
        This is the About Layout
      </h1>
      {children}
    </div>
  )
}

export default AboutLayout;