import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";
const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

class TodoPage {
  todoInput: By = By.className("new-todo");
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label");
  todoComplete: By = By.css("input");
  clearCompletedButton: By = By.css("button.clear-completed");

  driver: WebDriver;
  url: string = "https://devmountain.github.io/qa_todos/";
  constructor(driver: WebDriver) {
    this.driver = driver;
  }
}
const tp = new TodoPage(driver);

describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(tp.url);
  });
  afterAll(async () => {
    await driver.quit();
  });
  it("Addition", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    await driver.findElement(tp.todoInput).sendKeys("Walk the pupper\n");
  });
  it("Complete todo", async () => {
    let myTodos = await driver.findElements(tp.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Walk the pupper";
      })[0]
      .findElement(tp.todoComplete)
      .click();
    await (await driver.findElement(tp.clearCompletedButton)).click();
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Walk the pupper";
    });
    expect(myTodo.length).toEqual(0);
  });