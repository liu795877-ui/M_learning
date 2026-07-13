# Machine vision, 3D vision, and point clouds

Classify task, sensor, data representation, annotation, train/validation/test split, calibration, coordinate frames, and deployment target. Teach only the necessary chain:

`image formation and calibration → feature/representation → detection/segmentation/pose → depth or point cloud → registration/reconstruction → robot perception/control interface`.

For learning methods inspect data scale, class imbalance, augmentation, leakage, pretrained weights, metric definition, confidence intervals, compute budget, real-time latency, domain shift, and ablation fairness. For 3D work inspect camera intrinsics/extrinsics, depth noise, units, frame transforms, point density, correspondence, registration initialization, and geometric degeneracy.

Connect perception outputs to robot-control requirements: coordinate frame, uncertainty, update rate, delay, observability, failure cases, and how uncertainty propagates into control. Do not treat a benchmark accuracy gain as proof of safe closed-loop performance.
