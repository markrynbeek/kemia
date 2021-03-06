/**
 * Copyright 2010 Paul Novak (paul@wingu.com)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 */

goog.require('kemia.math.Line');
goog.require('goog.testing.jsunit');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');
goog.require('goog.math.Coordinate');

function setUp() {
	c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('LineTest');
}

function testTheta() {
	var l = new kemia.math.Line(new goog.math.Coordinate(0, 0),
			new goog.math.Coordinate(1, 1));
	assertEquals(Math.PI / 4, l.getTheta());

	l = new kemia.math.Line(new goog.math.Coordinate(0, 0),
			new goog.math.Coordinate(0, 1));
	assertEquals(Math.PI / 2, l.getTheta());

	l = new kemia.math.Line(new goog.math.Coordinate(0, 0),
			new goog.math.Coordinate(1, 0));
	assertEquals(0, l.getTheta());
	var l = new kemia.math.Line(new goog.math.Coordinate(0, 1),
			new goog.math.Coordinate(1, 1));

	l = new kemia.math.Line(new goog.math.Coordinate(0, 0),
			new goog.math.Coordinate(Math.sqrt(3), 1));
	assertRoughlyEquals(Math.PI / 6, l.getTheta(), .0000000000001);
}

function testPointsOnOppositeSideOfVertLine1() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(0, 1);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(1, 0);
	var point2 = new goog.math.Coordinate(-1, 0);
	assertFalse(line.isSameSide(point1, point2));
}

function testPointsOnSameSideOfVertLine2() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(0, 1);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(1, 0);
	var point2 = new goog.math.Coordinate(2, 0);
	assertTrue	(line.isSameSide(point1, point2));
}

function testPointsOnSameSideOfHorizontalLine1() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(1, 0);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(0, 1);
	var point2 = new goog.math.Coordinate(0, 2);
	assertTrue	(line.isSameSide(point1, point2));
}

function testPointsOnOppositeSideOfHorizontalLine1() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(1, 0);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(0, 1);
	var point2 = new goog.math.Coordinate(0, -1);
	assertFalse(line.isSameSide(point1, point2));
}
function testPointsOnSameSideOfDiagonalLine() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(1, 1);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(1, 2);
	var point2 = new goog.math.Coordinate(1, 3);
	assertTrue(line.isSameSide(point1, point2));
}

function testPointsOnOppositeSideOfDiagonalLine2() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(1, 1);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(1, 2);
	var point2 = new goog.math.Coordinate(1, -2);
	assertFalse(line.isSameSide(point1, point2));
}

function testPointsOnOppositeSideOfDiagonalLine1() {
	var source = new goog.math.Coordinate(0, 0);
	var target = new goog.math.Coordinate(1, 1);
	var line = new kemia.math.Line(source, target);
	var point1 = new goog.math.Coordinate(1, 2);
	var point2 = new goog.math.Coordinate(1, -1);
	assertFalse(line.isSameSide(point1, point2));
}
