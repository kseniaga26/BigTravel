import { render, RenderPosition } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import NoPointView from '../view/no-point-view.js';
import { updateItem } from '../util/common-elements.js';
import TripEventsView from "../view/trip-point-view.js";
import SubsidiaryPresenter from "./subsidiary-presenter.js";

export default class MainPresenter {
  #tripBox = null;
  #pointsModel = null;
  #boardPoints = null;

  #pointPresenter = new Map();

  #pointListComponent = new TripEventsView();
  #sortComponent = new SortingView();
  #noPointComponent = new NoPointView();

  constructor(tripBox, pointsModel) {
    this.#tripBox = tripBox;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
    }
    else {
      this.#renderSort();
      this.#renderPointList();
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripBox, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (from, to) => {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new SubsidiaryPresenter(this.#pointListComponent.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#tripBox, RenderPosition.AFTERBEGIN);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripBox);
    this.#renderPoints(0, this.#boardPoints.length);
  };
}
