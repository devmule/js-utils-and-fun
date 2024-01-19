/**
 * @class {Vector} representing a vector and its logic.
 * */
export class Vector extends Array<number> {
  /**
   * @description Add one vector values to another vector values.
   * Can work with different sizes vectors.
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {Vector} new Vector.
   * **/
  static add(v1: Vector, v2: Vector): Vector {
    return v1.clone().add(v2);
  }

  /**
   * @description Subtract one vector values to another vector values.
   * Can work with different sizes vectors.
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {Vector} new Vector.
   * **/
  static subtract(v1: Vector, v2: Vector): Vector {
    return v1.clone().subtract(v2);
  }

  /**
   * @description Multiply every value of given vectors clone by given value.
   * @param {Vector} v1
   * @param {number} val
   * @return {Vector} new Vector.
   * **/
  static multiply(v1: Vector, val: number): Vector {
    return v1.clone().multiply(val);
  }

  /**
   * @description Return dot product of given vectors.
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {number} dot product.
   * **/
  static dot(v1: Vector, v2: Vector): number {
    return v1.dot(v2);
  }

  /**
   * @description Cross product of vectors.
   * @param {Vector} vectors
   * @return {Vector} vector as normal of shape (normal of line in 2D, normal of plane in 3D, normal of volume in 4D etc.).
   * **/
  static cross(...vectors: Vector[]): Vector {
    // amount of vectors depends on vectors dimensions
    // amount of vectors = vectors dimensions - 1
    if (vectors.length === 0)
      throw new Error(`Need at least 1 vector as parameter`);

    const dim = vectors[0].length;
    for (let i = 1; i < vectors.length; i++)
      if (vectors[i].length !== dim) {
        throw new TypeError(
          `Vectors dimensions are different! Must be the same!`,
        );
      }

    if (dim < 2) {
      throw new TypeError(
        `Vectors with dimension less than 2 cannot have a cross product`,
      );
    }

    if (vectors.length !== dim - 1) {
      throw new TypeError(
        `Wrong amount of vectors! need ${dim - 1}, got ${vectors.length}!`,
      );
    }

    const result: Vector = vectors[0].clone();

    const det = (matrix: number[][]) => {
      // we've got square matrices, so w == h;
      if (matrix.length === 1) return matrix[0][0]; // det of 1x1 matrix is its element

      let d = 0;
      for (let i = 0; i < matrix.length; i++) {
        // for each associative element in 1-st col
        const newMatrix: number[][] = []; // create matrix to calculate it's det
        for (let y = i + 1; y < i + matrix.length; y++) {
          // matrix.length is equivalent to dim
          const line = [];
          for (let x = 1; x < matrix.length + 1; x++) {
            line.push(matrix[y % matrix.length][x % matrix.length]);
          }
          newMatrix.push(line);
        }
        d += matrix[i][0] * det(newMatrix) * (i % 2 ? -1 : 1);
      }
      return d;
    };

    for (let i = 0; i < dim; i++) {
      // for each element of new vector
      const matrix: number[][] = []; // create a matrix for calculating a det
      for (const [y, vector] of vectors.entries()) {
        matrix[y] = [];
        for (let x = i + 1; x < i + dim; x++) {
          matrix[y].push(vector[x % dim]);
        }
      }
      result[i] = det(matrix) * (i % 2 ? -1 : 1);
    }

    return result;
  }

  // trigonometry
  /**
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {Number} cosine of angle between given vectors.
   * **/
  static cos(v1: Vector, v2: Vector): number {
    return v1.cos(v2);
  }

  /**
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {number} angle between given vectors in radians.
   * **/
  static angle(v1: Vector, v2: Vector): number {
    return v1.angle(v2);
  }

  /**
   * @constructor
   * @param {[number[]]} values
   * **/
  constructor(...values: number[]);
  /**
   * @constructor
   * @param {number[]} array
   * **/
  constructor(array: number[]);
  /**
   * @internal implementation
   * **/
  constructor(...parameters: number[] | [number[]]) {
    super();
    if (Array.isArray(parameters[0])) {
      this.setFromArray(parameters[0]);
    } else if (Array.isArray(parameters)) {
      this.setFromArray(parameters as number[]);
    }
  }

  /**
   * @description Read elements from given array.
   * @param {number[]} array
   * @return {Vector} self.
   * **/
  setFromArray(array: number[]): this {
    this.length = array.length;
    for (let i = 0; i < array.length; i++) this[i] = array[i];
    return this;
  }

  /**
   * @return {number} scalar value of vector magnitude.
   * **/
  get magnitude(): number {
    return Math.sqrt(this.reduce((sum, val) => sum + val * val, 0));
  }

  /**
   * @param {number} magnitude
   * **/
  set magnitude(magnitude: number) {
    const factor = magnitude / this.magnitude;
    for (let i = 0; i < this.length; i++) {
      this[i] *= factor;
    }
  }

  /**
   * @return {Vector} new {@link Vector} instance with same values and dimensions.
   * **/
  clone(): Vector {
    return new Vector(this);
  }

  // simple operations
  /**
   * @description Add given vector values to this vector values.
   * Can work with different sizes vectors.
   * @param {Vector} v
   * @return {Vector} self
   * **/
  add(v: Vector): this {
    for (let i = 0; i < Math.min(this.length, v.length); i++) this[i] += v[i];
    return this;
  }

  /**
   * @description Subtract given vector values from this vector values.
   * Can work with different sizes vectors.
   * @param {Vector} v
   * @return {Vector} self
   * **/
  subtract(v: Vector): this {
    for (let i = 0; i < Math.min(this.length, v.length); i++) this[i] -= v[i];
    return this;
  }

  // scalar multiplication
  /**
   * @description Multiply every value of vector by given value.
   * @param {number} value
   * @return {Vector} self
   * **/
  multiply(value: number): this {
    for (let i = 0; i < this.length; i++) this[i] *= value;
    return this;
  }

  // vectors multiplications
  /**
   * @param {Vector} v
   * @return {number} dot product of this vector and given vector.
   * **/
  dot(v: Vector): number {
    let val = 0;
    for (let i = 0; i < Math.min(this.length, v.length); i++)
      val += this[i] * v[i];
    return val;
  }

  /**
   * @description Cross product of this vector and given vectors.
   * @param {Vector[]} vector
   * @return {Vector} new vector as normal of shape (normal of line in 2D, normal of plane in 3D, normal of volume in 4D etc.).
   * **/
  cross(...vector: Vector[]) {
    return Vector.cross(this, ...vector);
  }

  // trigonometry
  /**
   * @param {Vector} v
   * @return {number} cos of angle between this vector and given vector.
   * **/
  cos(v: Vector): number {
    return this.dot(v) / (this.magnitude * v.magnitude);
  }

  /**
   * @param {Vector} v
   * @return {number} angle between this vector and given vector in radians.
   * **/
  angle(v: Vector): number {
    return Math.acos(this.cos(v));
  }
}
