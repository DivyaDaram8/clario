import React from "react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

function Todo() {
    return (
        <>
            <NavbarLeft />
            <NavbarTop />
            <h1 className="text-4xl font-bold text-center text-blue-600 my-4 mt-26">
                My To-Do List 
            </h1>
        </>
    )
};

export default Todo;