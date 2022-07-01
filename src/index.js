import "@styles/styles.css";
import * as $ from "jquery";
import Post from "./Post";
import crab from "@assets/crab";
import "./babel.js";
import "@styles/styles.less";
import "@styles/styles.scss";

// import json from './assets/sample3'
// import xml from './assets/note.xml'

const post = new Post("Webpack post title", crab);

$("pre").html(post.toString());

// console.log('JSON:', json)
// console.log('XML:', xml)