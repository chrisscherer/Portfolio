using UnityEngine;
using System.Collections;

public class ThirdPersonController : MonoBehaviour {
	private float maxSpeed;
	private float curSpeed;
	private float acceleration;
	private float gravity;
	private float runSpeed;
	private float boostSpeed;
	private float flySpeed;
	
	private int playerID;

	private bool flying = true;
	private bool boosting = false;

	private Transform transTarget;

	private Vector3 lastInput;
	private Vector3 lastRight;
	private Vector3 lastForward;
	private Vector3 lastUp;

	Transform character;
	Animator anim;

	CharacterController myController; 

	public float MaxSpeed
	{
		get
		{
			return maxSpeed;
		}
		set
		{
			maxSpeed = value;
		}
	}

	public float CurSpeed
	{
		get
		{
			return curSpeed;
		}
		set
		{
			curSpeed = value;
		}
	}

	public float Acceleration
	{
		get
		{
			return acceleration;
		}
		set
		{
			acceleration = value;
		}
	}

	public float Gravity
	{
		get
		{
			return gravity;
		}
		set
		{
			gravity = value;
		}
	}

	public float RunSpeed
	{
		get
		{
			return runSpeed;
		}
		set
		{
			runSpeed = value;
		}
	}

	public float BoostSpeed
	{
		get
		{
			return boostSpeed;
		}
		set
		{
			boostSpeed = value;
		}
	}

	public float FlySpeed
	{
		get
		{
			return flySpeed;
		}
		set
		{
			flySpeed = value;
		}
	}

	public int PlayerID
	{
		get
		{
			return playerID;
		}
		set
		{
			playerID = value;
		}
	}

	public Vector3 LastInput
	{
		get
		{
			return lastInput;
		}
		set
		{
			lastInput = value;
		}
	}

	public bool Boosting
	{
		get
		{
			return boosting;
		}
		set
		{
			boosting = value;
		}
	}
	
	// Use this for initialization
	void Start () {
		character = transform.GetChild (0);
		anim = transform.GetComponent<Animator>();
		myController = gameObject.GetComponent<CharacterController>();
		transTarget = Camera.main.transform;
		lastInput = Vector3.zero;
		lastRight = transform.right;
		lastUp = transform.up;
		lastForward = transform.forward;
		curSpeed = 0;
		flySpeed = maxSpeed;
		runSpeed = maxSpeed / 2;
		boostSpeed = maxSpeed * .75f;
	}
	
	// Update is called once per frame
	void Update () {
		// Clean up loose code!!!
		Vector3 inputDir = getMoveInput();
		flyingStuff(inputDir);
		processMovement(inputDir, transTarget);
	}
	
	private Vector3 getMoveInput(){
		Vector3 inputDirection = Vector3.zero;
		if(flying){
			if(Input.GetKey(KeyCode.Space)){
				inputDirection.y = 1;
			}
			else if(Input.GetKey(KeyCode.LeftShift)){
				inputDirection.y = -1;
			}
		}
		else{
			if(Input.GetKey (KeyCode.LeftShift)){
				boosting = true;
			}
			else{
				boosting = false;
			}
		}

		if(Input.GetKey(KeyCode.W)){
			inputDirection.z = 1;
		}
		else if(Input.GetKey(KeyCode.S)){
			inputDirection.z = -1;
		}

		if(Input.GetKey(KeyCode.D)){
			inputDirection.x = 1;
		}
		else if(Input.GetKey(KeyCode.A)){
			inputDirection.x = -1;
		}
		return inputDirection;
	}

	private void processMovement(Vector3 input, Transform dirTarget){
		if(input != Vector3.zero){
			accelerate();
			myController.Move(dirTarget.right * input.x * curSpeed * Time.deltaTime);
			myController.Move(dirTarget.up * input.y * curSpeed * Time.deltaTime);
			myController.Move(dirTarget.forward * input.z * curSpeed * Time.deltaTime);
			lastInput = input;
			lastRight = transform.right;
			lastUp = transform.up;
			lastForward = transform.forward;
		}
		else{
			decelerate();
			myController.Move(lastRight * lastInput.x * curSpeed * Time.deltaTime);
			myController.Move(lastUp * lastInput.y * curSpeed * Time.deltaTime);
			myController.Move(lastForward * lastInput.z * curSpeed * Time.deltaTime);
		}
	}

	private void flyingStuff(Vector3 inputDir){
		if(Input.GetKeyDown(KeyCode.F)){
			flying = !flying;
			if(!flying){
				gameObject.GetComponent<MyMouseLook>().minimumY = -20;
				gameObject.GetComponent<MyMouseLook>().maximumY = 20;
				if(!myController.isGrounded){
					myController.Move(-transform.up * 4.5f);
				}
				transTarget = gameObject.transform;
			}
			else{
				transTarget = Camera.main.transform;
				gameObject.GetComponent<MyMouseLook>().minimumY = -1080;
				gameObject.GetComponent<MyMouseLook>().maximumY = 1080;
			}
		}
		
		Vector3 vel = Camera.main.transform.forward * Input.GetAxis("Vertical") * flySpeed / 20 + Camera.main.transform.right * Input.GetAxis("Horizontal") * flySpeed / 20;
		Vector3 velY = transform.up * inputDir.y * flySpeed;
		
		vel.y = 0;
		
		Vector3 localvel = transform.InverseTransformDirection(vel);
		
		if(Input.GetKeyDown(KeyCode.Escape)){
			Screen.lockCursor = !Screen.lockCursor;
			gameObject.GetComponent<MyMouseLook>().enabled = !gameObject.GetComponent<MyMouseLook>().enabled;
		}
		
		if(anim != null){
			AnimatorStateInfo stateInfo = anim.GetCurrentAnimatorStateInfo(0);
			anim.SetFloat("xSpeed", localvel.x);
			anim.SetFloat("zSpeed", localvel.z);
			anim.SetFloat("ySpeed", velY.y);
		}
		
		if(Input.GetKeyDown(KeyCode.Escape)){
			Screen.showCursor = !Screen.showCursor;
		}
	}

	private void accelerate(){
		if(flying){
			maxSpeed = flySpeed;
		}
		else if(boosting){
			maxSpeed = boostSpeed;
		}
		else{
			maxSpeed = runSpeed;
		}

		if(curSpeed <= maxSpeed){
			curSpeed += acceleration;
		}
		else if(curSpeed > maxSpeed){
			curSpeed = maxSpeed;
		}
	}

	private void decelerate(){
		if(curSpeed > 0){
			curSpeed -= acceleration * 1.5f;
		}
	}
}