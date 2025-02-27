import React from "react";

const Footer = () => {
	var d = new Date();
	return (
		<div className="footer out-footer">
			<div className="copyright">
				<p>Copyright © 
					{/* Designed &amp;  */}
					{" "}Developed by{" "}
					<a href="https://www.jbdspower.com/" target="_blank"  rel="noreferrer">
						JBDS Power
					</a>{" "}
					{d.getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default Footer;
